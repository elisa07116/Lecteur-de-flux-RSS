class FeedSerializer < ActiveModel::Serializer
  attributes :id, :title, :url, :unread_items_count, :total_items_count, :created_at, :updated_at

  def unread_items_count
    object.unread_items_count
  end

  def total_items_count
    object.feed_items.count
  end
end 