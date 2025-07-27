class FeedItemSerializer < ActiveModel::Serializer
  attributes :id, :title, :summary, :url, :published_at, :read, :created_at, :updated_at
  belongs_to :feed
end 