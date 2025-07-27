class Api::V1::FeedItemsController < Api::V1::BaseController
  before_action :set_feed_item, only: [:show, :toggle_read]

  def index
    @feed = Feed.find(params[:feed_id])
    @feed_items = @feed.feed_items.recent
    
    # Pagination
    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 5).to_i
    offset = (page - 1) * per_page
    
    @feed_items = @feed_items.offset(offset).limit(per_page)
    
    render json: {
      feed_items: @feed_items,
      pagination: {
        current_page: page,
        per_page: per_page,
        total_count: @feed.feed_items.count,
        total_pages: (@feed.feed_items.count.to_f / per_page).ceil
      }
    }
  end

  def show
    render json: @feed_item
  end

  def toggle_read
    if @feed_item.read?
      @feed_item.mark_as_unread!
    else
      @feed_item.mark_as_read!
    end
    
    render json: @feed_item
  end

  private

  def set_feed_item
    @feed_item = FeedItem.find(params[:id])
  end
end 