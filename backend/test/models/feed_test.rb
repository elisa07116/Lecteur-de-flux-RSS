require "test_helper"

class FeedTest < ActiveSupport::TestCase
  def setup
    @feed = Feed.new(
      title: "Test Feed",
      url: "https://example.com/rss.xml"
    )
  end

  test "should be valid" do
    assert @feed.valid?
  end

  test "title should be present" do
    @feed.title = "   "
    assert_not @feed.valid?
  end

  test "url should be present" do
    @feed.url = "   "
    assert_not @feed.valid?
  end

  test "url should be unique" do
    duplicate_feed = @feed.dup
    @feed.save
    assert_not duplicate_feed.valid?
  end

  test "url should be valid format" do
    valid_urls = %w[https://example.com/rss.xml http://test.com/feed.xml]
    valid_urls.each do |valid_url|
      @feed.url = valid_url
      assert @feed.valid?, "#{valid_url} should be valid"
    end
  end

  test "url should reject invalid format" do
    invalid_urls = %w[not-a-url ftp://example.com invalid]
    invalid_urls.each do |invalid_url|
      @feed.url = invalid_url
      assert_not @feed.valid?, "#{invalid_url} should be invalid"
    end
  end

  test "should count unread items" do
    @feed.save
    @feed.feed_items.create!(title: "Item 1", url: "https://example.com/1", read: false)
    @feed.feed_items.create!(title: "Item 2", url: "https://example.com/2", read: true)
    
    assert_equal 1, @feed.unread_items_count
  end

  test "should get latest items" do
    @feed.save
    @feed.feed_items.create!(title: "Item 1", url: "https://example.com/1")
    @feed.feed_items.create!(title: "Item 2", url: "https://example.com/2")
    
    latest = @feed.latest_items(1)
    assert_equal 1, latest.count
    assert_equal "Item 2", latest.first.title
  end
end 