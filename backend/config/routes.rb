Rails.application.routes.draw do
  # Routes API
  namespace :api do
    namespace :v1 do
      resources :feeds do
        collection do
          post :fetch_all
        end
        member do
          post :fetch_all
        end
        resources :feed_items, only: [:index, :show] do
          member do
            post :toggle_read
          end
        end
      end
      
      # Route alternative pour toggle_read sans feed_id
      resources :feed_items, only: [] do
        member do
          post :toggle_read
        end
      end
    end
  end

  # Routes Web (pour l'interface Rails existante)
  root 'feeds#index'
  
  resources :feeds do
    member do
      get :show
    end
  end
  
  resources :feed_items, only: [] do
    member do
      post :toggle_read
    end
  end
end
