class RssFetcherService
  def self.fetch_all_feeds
    Feed.find_each do |feed|
      fetch_feed(feed)
    rescue => e
      Rails.logger.error "Erreur lors de la récupération du flux #{feed.url}: #{e.message}"
    end
  end

  def self.fetch_feed(feed)
    require 'feedjira'
    require 'net/http'
    
    # Utiliser Net::HTTP pour récupérer le contenu RSS
    uri = URI(feed.url)
    response = Net::HTTP.get(uri)
    feed_data = Feedjira.parse(response)
    
    feed_data.entries.each do |entry|
      next if FeedItem.exists?(url: entry.url)
      
      FeedItem.create!(
        feed: feed,
        title: entry.title,
        summary: entry.summary,
        url: entry.url,
        published_at: entry.published,
        read: false
      )
    end
  rescue => e
    Rails.logger.error "Erreur lors de la récupération du flux #{feed.url}: #{e.message}"
  end
end 