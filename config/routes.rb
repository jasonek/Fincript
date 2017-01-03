Rails.application.routes.draw do
  get "/", to: "users#index", as: "home" #LANDING PAGE
  get "/users", to: "users#index", as: "users" #users_path needed for form_for
  post "/users", to: "users#create"
  get "/register", to: "users#new", as: "register" #REGISTRATION
  post "/users/save_data", to: "users#save_data", as: "save"

  get "/sessions", to: "sessions#index", as: "sessions"
  get "/login", to: "sessions#new", as: "login" #LOGIN PAGE
  post "/login", to: "sessions#create"
  get "/unlock", to: "sessions#unlock", as: "unlock" #UNLOCK & DECRYPT PAGE
  get "/logout", to: "sessions#destroy", as: "logout" #GET or DELETE request?
  get "/dashboard", to: "sessions#dashboard", as: "dashboard"
  get "/sessions/api", to: "sessions#api" #fetches logged-in user's "data" field to then decrypt and show


  # resources :users
  # resources :sessions

  root "users#index"
end
