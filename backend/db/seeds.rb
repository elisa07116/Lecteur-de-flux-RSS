puts "🌱 Ajout de flux RSS d'exemple..."

feeds_data = [
  {
    title: "Le Monde - Actualités",
    url: "https://www.lemonde.fr/rss/une.xml"
  },
  {
    title: "20 Minutes - Actualités",
    url: "https://www.20minutes.fr/rss/une.xml"
  },
  {
    title: "TechCrunch",
    url: "https://techcrunch.com/feed/"
  },
  {
    title: "Le Figaro - Actualités",
    url: "https://www.lefigaro.fr/rss/figaro_actualites.xml"
  }
]

feeds_data.each do |feed_data|
  feed = Feed.find_or_create_by(url: feed_data[:url]) do |f|
    f.title = feed_data[:title]
  end
  
  if feed.persisted?
    puts "✅ Flux ajouté: #{feed.title}"
  else
    puts "❌ Erreur lors de l'ajout du flux: #{feed.title}"
    puts "   Erreurs: #{feed.errors.full_messages.join(', ')}"
  end
end

puts ""
puts "🎉 Seeds terminées !"
puts ""
puts "Pour récupérer les articles des flux RSS:"
puts "  rails runner 'RssFetcherService.fetch_all_feeds'"
puts ""
puts "Puis lancez l'application:"
puts "  rails server"
