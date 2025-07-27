class FeedItemsController < ApplicationController
  before_action :set_feed_item, only: [:toggle_read]

  def toggle_read
    if @feed_item.read?
      @feed_item.mark_as_unread!
    else
      @feed_item.mark_as_read!
    end
    
    respond_to do |format|
      format.js
      format.json { render json: { read: @feed_item.read } }
    end
  end

  private

  def set_feed_item
    @feed_item = FeedItem.find(params[:id])
  end
end 