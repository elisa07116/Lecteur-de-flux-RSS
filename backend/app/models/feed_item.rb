class FeedItem < ApplicationRecord
  belongs_to :feed
  
  validates :title, presence: true
  validates :url, presence: true, uniqueness: true, format: { with: URI::regexp }
  
  scope :unread, -> { where(read: false) }
  scope :read, -> { where(read: true) }
  scope :recent, -> { order(published_at: :desc) }
  
  def mark_as_read!
    update!(read: true)
  end
  
  def mark_as_unread!
    update!(read: false)
  end
end 