Rails.application.routes.draw do
  get "/", to: "users#index", as: "home"
  get "/register", to: "users#new", as: "register"
  get "/login", to: "sessions#new", as: "login"
  get "/unlock", to: "sessions#unlock", as: "unlock"
  get "/logout", to: "sessions#destroy", as: "logout" #GET or DELETE request?
  get "/dashboard", to: "sessions#dashboard", as: "dashboard"
  get "/sessions/api", to: "sessions#api"
  post "/users/save_data", to: "users#save_data", as: "save"

  resources :users
  resources :sessions

  root "users#index"
end
