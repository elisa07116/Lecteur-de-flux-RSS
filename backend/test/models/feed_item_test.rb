require "test_helper"

class FeedItemTest < ActiveSupport::TestCase
  def setup
    @feed = Feed.create!(title: "Test Feed", url: "https://example.com/rss.xml")
    @feed_item = @feed.feed_items.build(
      title: "Test Item",
      url: "https://example.com/article1",
      summary: "This is a test article",
      published_at: Time.current
    )
  end

  test "should be valid" do
    assert @feed_item.valid?
  end

  test "title should be present" do
    @feed_item.title = "   "
    assert_not @feed_item.valid?
  end

  test "url should be present" do
    @feed_item.url = "   "
    assert_not @feed_item.valid?
  end

  test "url should be unique" do
    @feed_item.save
    duplicate_item = @feed_item.dup
    assert_not duplicate_item.valid?
  end

  test "should belong to a feed" do
    @feed_item.feed = nil
    assert_not @feed_item.valid?
  end

  test "should have read scope" do
    @feed_item.read = true
    @feed_item.save
    assert_includes FeedItem.read, @feed_item
  end

  test "should have unread scope" do
    @feed_item.read = false
    @feed_item.save
    assert_includes FeedItem.unread, @feed_item
  end

  test "should mark as read" do
    @feed_item.read = false
    @feed_item.save
    @feed_item.mark_as_read!
    assert @feed_item.reload.read?
  end

  test "should mark as unread" do
    @feed_item.read = true
    @feed_item.save
    @feed_item.mark_as_unread!
    assert_not @feed_item.reload.read?
  end
end 