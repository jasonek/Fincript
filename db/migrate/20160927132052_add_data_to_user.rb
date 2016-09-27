class AddDataToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :data, :text, :limit => nil
  end
end
