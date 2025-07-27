# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2024_12_19_000002) do
  create_table "feed_items", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "feed_id", null: false
    t.string "title", null: false
    t.text "summary"
    t.datetime "published_at", precision: nil
    t.string "url", null: false
    t.boolean "read", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["feed_id"], name: "index_feed_items_on_feed_id"
    t.index ["published_at"], name: "index_feed_items_on_published_at"
    t.index ["read"], name: "index_feed_items_on_read"
    t.index ["url"], name: "index_feed_items_on_url", unique: true
  end

  create_table "feeds", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "title", null: false
    t.string "url", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["url"], name: "index_feeds_on_url", unique: true
  end

  add_foreign_key "feed_items", "feeds"
end
