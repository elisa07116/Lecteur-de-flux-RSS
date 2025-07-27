ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors)

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
  
  # Helper pour créer des flux de test
  def create_test_feed(title: "Test Feed", url: "https://example.com/rss.xml")
    Feed.create!(title: title, url: url)
  end
  
  # Helper pour créer des éléments de flux de test
  def create_test_feed_item(feed, title: "Test Article", url: "https://example.com/article1", read: false)
    feed.feed_items.create!(
      title: title,
      url: url,
      summary: "Test summary",
      published_at: Time.current,
      read: read
    )
  end
end
