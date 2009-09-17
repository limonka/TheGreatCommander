namespace :data do 
  desc('Creating simple map with game')   
  task(:game_create => :map_create) do        
    
      Game.delete_all  #debug
      Player.delete_all
#      game = Game.create
#      game.name = "Justin's game"     
#      game.map = Map.find_by_name("Justin's map")     
#      game.save!   
  end
  desc('Creating units')
  task(:unit_create => :environment) do
    counter = 1    
    PlayerUnit.delete_all
#   file = File.new("justin2.txt")            
    dir2 = Dir.pwd   
    Dir.chdir(Dir.pwd + "/public/images/") do  
      if File.exist?("units")
        Unit.delete_all        
        Dir.chdir(Dir.pwd + "/units/")        
        Dir.foreach(".") do |filename|          
          puts filename[0,7].to_s
          if ((filename != ".") and (filename != "..") and (filename != ".svn")and (filename[0,7]!="checked") and (filename[0,7]!="blocked"))
            t = Unit.create            
            t.name = File.basename(filename, ".png")            
            f = File.open(filename,"rb")            
            t.image = f.read  
            f_b = File.open(Dir.pwd + "/blocked_" + t.name + ".png","rb")
            f_ch = File.open(Dir.pwd + "/checked_" + t.name + ".png","rb")
            f_b_ch = File.open(Dir.pwd + "/blocked_checked_" + t.name + ".png","rb")
            t.image_blocked= f_b.read
            t.image_checked= f_ch.read
            t.image_blocked_checked = f_b_ch.read
            if t.save
              puts t.name
              counter = counter + 1
            end
          end
        end            
        puts "Created #{counter - 1} units"
      else
        puts "Dir 'unit' does not exists, rake aborted"
      end
    end  
  end 
  desc('Creating map from files')
  task(:map_create => :terrain_create) do     
    x = 0
    y = 0
    terrain_array = []
    
    Map.delete_all#debug
    
    map = Map.create
    
    MapTerrainPosition.delete_all #debug
    
    Dir.chdir(Dir.pwd + "/public/maps/")    
    file = File.new("justin2.txt")
    name = file.gets.chomp
    size_x = file.gets.to_i
    size_y = file.gets.to_i
    file.each_line do |line|      
      x = 0
      terrain_array = line.split(" ")
      terrain_array.each do |c|                                      
          puts "[#{y},#{x}] #{c}"          
          terrain_pos = MapTerrainPosition.create 
          terrain_pos.x = x
          terrain_pos.y = y
          terrain_pos.terrain = Terrain.find_by_short_name(c)
          map.map_terrain_positions << terrain_pos  
          terrain_pos.save!
          x = x + 1 
      end     
      y = y + 1
    end
    
    map.name =  name
    map.size_x = size_x
    map.size_y = size_y
    map.save!
    file.close
  end
  
  desc('Creating terrain')
  task(:terrain_create => :environment) do    
    @counter = 1
    Dir.chdir(Dir.pwd + "/public/images/") do    
      if File.exist?("terrains")     
        Terrain.delete_all    
        Dir.chdir(Dir.pwd + "/terrains/")          
        Dir.foreach(".") do |filename|                          
          if ((filename != ".") and (filename != "..") and (filename.length > 6))                           
            t = Terrain.create                                   
            t.name = File.basename(filename, ".jpg")               
            short = filename.split("_")
            t.short_name = short[0]                        
            f = File.open(filename,"rb")            
            t.image = f.read                    
            t.save!        
            if t.save 
              puts t.name
              @counter = @counter + 1  
            end            
          end          
        end
        puts "Created #{@counter - 1} terrains"
      else
        puts "Dir 'terrain' does not exists, rake aborted"
      end     
    end    
    
  end  
end