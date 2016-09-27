class AddEncryptedEmailSaltToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :encrypted_email_salt, :string
  end
end
