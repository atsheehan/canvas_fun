require 'sinatra'

public_dir = File.join(File.dirname(__FILE__), 'public')

get '/' do
  File.read(File.join(public_dir, 'index.html'))
end

set :public_folder, public_dir
