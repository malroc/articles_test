class CreateArticles < ActiveRecord::Migration[6.0]
  def change
    create_table :articles do |t|
      t.string :name, null: false
      t.text :text, null: false
      t.integer :article_type, null: false, default: 0
      t.belongs_to :story, null: false, foreign_key: true

      t.timestamps
    end
  end
end
