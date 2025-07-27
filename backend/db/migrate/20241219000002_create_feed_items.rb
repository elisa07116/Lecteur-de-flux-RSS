class CreateFeedItems < ActiveRecord::Migration[6.1]
  def change
    create_table :feed_items do |t|
      t.references :feed, null: false, foreign_key: true
      t.string :title, null: false
      t.text :summary
      t.datetime :published_at
      t.string :url, null: false
      t.boolean :read, default: false
      t.timestamps
    end
    
    add_index :feed_items, :url, unique: true
    add_index :feed_items, :read
    add_index :feed_items, :published_at
  end
end 