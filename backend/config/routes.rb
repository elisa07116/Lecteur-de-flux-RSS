Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :feeds do
        collection do
          post :fetch_all
        end
        resources :feed_items, only: [:index, :show] do
          member do
            post :toggle_read
          end
        end
      end
      resources :feed_items, only: [] do
        member do
          post :toggle_read
        end
      end
    end
  end
end
