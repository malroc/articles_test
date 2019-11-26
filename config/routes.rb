Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :articles, only: [:index, :create, :destroy]
      resources :stories, only: :index
    end
  end

  resources :articles, only: :index

  root to: redirect("/articles")
end
