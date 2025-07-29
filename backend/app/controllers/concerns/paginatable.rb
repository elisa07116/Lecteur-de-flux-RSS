module Paginatable
  extend ActiveSupport::Concern

  def paginate(collection, per_page = 5)
    page = (params[:page] || 1).to_i
    offset = (page - 1) * per_page
    
    total_count = collection.count
    total_pages = (total_count.to_f / per_page).ceil
    
    collection.define_singleton_method(:current_page) { page }
    collection.define_singleton_method(:total_pages) { total_pages }
    collection.define_singleton_method(:limit_value) { per_page }
    collection.define_singleton_method(:offset_value) { offset }
    
    collection.offset(offset).limit(per_page)
  end
end 