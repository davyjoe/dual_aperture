class CreateEmailDigestReaders < ActiveRecord::Migration
  def change
    create_table :email_digest_readers do |t|
      t.string :email

      t.timestamps
    end
  end
end
