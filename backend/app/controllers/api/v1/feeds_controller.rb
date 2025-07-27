class Api::V1::FeedsController < Api::V1::BaseController
  before_action :set_feed, only: [:show, :update, :destroy]

  def index
    @feeds = Feed.includes(:feed_items).all
    render json: @feeds
  end

  def show
    render json: @feed
  end

  def create
    @feed = Feed.new(feed_params)
    
    if @feed.save
      # Déclencher automatiquement la récupération des articles
      begin
        RssFetcherService.fetch_feed(@feed)
      rescue => e
        Rails.logger.error "Erreur lors de la récupération automatique du flux #{@feed.url}: #{e.message}"
      end
      
      render json: @feed, status: :created
    else
      render json: { errors: @feed.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @feed.update(feed_params)
      render json: @feed
    else
      render json: { errors: @feed.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @feed.destroy
    head :no_content
  end

  def fetch_all
    begin
      RssFetcherService.fetch_all_feeds
      render json: { message: 'Récupération des flux terminée' }
    rescue => e
      render json: { error: e.message }, status: :internal_server_error
    end
  end

  private

  def set_feed
    @feed = Feed.find(params[:id])
  end

  def feed_params
    params.require(:feed).permit(:title, :url)
  end
end 