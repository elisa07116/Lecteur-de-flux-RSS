require "test_helper"

class RssFetcherServiceTest < ActiveSupport::TestCase
  def setup
    @feed = Feed.create!(title: "Test Feed", url: "https://example.com/rss.xml")
  end

  test "should fetch feed without errors" do
    # Mock Feedjira pour éviter les appels réseau réels
    mock_feed = mock()
    mock_entry = mock()
    
    mock_entry.stubs(:title).returns("Test Article")
    mock_entry.stubs(:summary).returns("Test summary")
    mock_entry.stubs(:url).returns("https://example.com/article1")
    mock_entry.stubs(:published).returns(Time.current)
    
    mock_feed.stubs(:entries).returns([mock_entry])
    
    Feedjira::Feed.stubs(:fetch_and_parse).returns(mock_feed)
    
    assert_nothing_raised do
      RssFetcherService.fetch_feed(@feed)
    end
  end

  test "should handle feed parsing errors gracefully" do
    Feedjira::Feed.stubs(:fetch_and_parse).raises(StandardError.new("Network error"))
    
    assert_nothing_raised do
      RssFetcherService.fetch_feed(@feed)
    end
  end

  test "should not create duplicate feed items" do
    mock_feed = mock()
    mock_entry = mock()
    
    mock_entry.stubs(:title).returns("Test Article")
    mock_entry.stubs(:summary).returns("Test summary")
    mock_entry.stubs(:url).returns("https://example.com/article1")
    mock_entry.stubs(:published).returns(Time.current)
    
    mock_feed.stubs(:entries).returns([mock_entry])
    
    Feedjira::Feed.stubs(:fetch_and_parse).returns(mock_feed)
    
    # Première récupération
    RssFetcherService.fetch_feed(@feed)
    initial_count = @feed.feed_items.count
    
    # Deuxième récupération (même contenu)
    RssFetcherService.fetch_feed(@feed)
    final_count = @feed.feed_items.count
    
    assert_equal initial_count, final_count, "Ne devrait pas créer de doublons"
  end

  test "should create feed items with correct attributes" do
    mock_feed = mock()
    mock_entry = mock()
    
    mock_entry.stubs(:title).returns("Test Article")
    mock_entry.stubs(:summary).returns("Test summary")
    mock_entry.stubs(:url).returns("https://example.com/article1")
    mock_entry.stubs(:published).returns(Time.current)
    
    mock_feed.stubs(:entries).returns([mock_entry])
    
    Feedjira::Feed.stubs(:fetch_and_parse).returns(mock_feed)
    
    RssFetcherService.fetch_feed(@feed)
    
    feed_item = @feed.feed_items.first
    assert_equal "Test Article", feed_item.title
    assert_equal "Test summary", feed_item.summary
    assert_equal "https://example.com/article1", feed_item.url
    assert_not feed_item.read, "Les nouveaux articles doivent être non lus"
  end
end 