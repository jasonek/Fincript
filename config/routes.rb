Rails.application.routes.draw do
  get "/register", to: "users#new", as: "register"
  get "/login", to: "sessions#new", as: "login"
  delete "logout", to: "sessions#destroy", as: "logout" #GET or DELETE request?

  resources :users
  resources :sessions

  root "users#new"
end
