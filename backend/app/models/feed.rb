class Feed < ApplicationRecord
  has_many :feed_items, dependent: :destroy
  
  validates :title, presence: true
  validates :url, presence: true, uniqueness: true, format: { with: URI::regexp }
  
  def unread_items_count
    feed_items.where(read: false).count
  end
  
  def latest_items(limit = 5)
    feed_items.order(published_at: :desc).limit(limit)
  end
end 