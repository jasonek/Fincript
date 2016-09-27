class AddEncryptedEmailToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :encrypted_email, :string
  end
end
