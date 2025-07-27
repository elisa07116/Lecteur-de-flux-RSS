class FeedsController < ApplicationController
  include Paginatable
  
  before_action :set_feed, only: [:show, :destroy]

  def index
    @feeds = Feed.includes(:feed_items).all
  end

  def show
    @feed_items = paginate(@feed.feed_items.recent, 5)
  end

  def new
    @feed = Feed.new
  end

  def create
    @feed = Feed.new(feed_params)
    
    if @feed.save
      redirect_to feeds_path, notice: 'Flux ajouté avec succès.'
    else
      render :new
    end
  end

  def destroy
    @feed.destroy
    redirect_to feeds_path, notice: 'Flux supprimé avec succès.'
  end

  private

  def set_feed
    @feed = Feed.find(params[:id])
  end

  def feed_params
    params.require(:feed).permit(:title, :url)
  end
end 