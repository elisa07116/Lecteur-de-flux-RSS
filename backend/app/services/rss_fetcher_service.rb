class RssFetcherService
  def self.fetch_all_feeds
    Rails.logger.info "🔄 Début de la récupération de tous les flux RSS..."
    feeds_count = Feed.count
    Rails.logger.info "📊 Nombre de flux à traiter: #{feeds_count}"
    
    processed_count = 0
    error_count = 0
    
    Feed.find_each do |feed|
      begin
        Rails.logger.info "📡 Traitement du flux: #{feed.title} (#{feed.url})"
        fetch_feed(feed)
        processed_count += 1
        Rails.logger.info "✅ Flux traité avec succès: #{feed.title}"
      rescue => e
        error_count += 1
        Rails.logger.error "❌ Erreur lors de la récupération du flux #{feed.url}: #{e.message}"
      end
    end
    
    Rails.logger.info "🏁 Récupération terminée - Traités: #{processed_count}, Erreurs: #{error_count}"
    { processed: processed_count, errors: error_count }
  end

  def self.fetch_feed(feed)
    require 'feedjira'
    require 'net/http'
    
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