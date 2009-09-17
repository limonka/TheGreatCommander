namespace :properties do 
desc('Creating unit properties')
  task(:unit_properties_create => :environment) do     
    
    UnitProperty.delete_all#debug
    unit_prop = nil
    u = nil
    Dir.chdir(Dir.pwd + "/public/properties/")    
    file = File.new("unit_properties.txt")
    i = 0
    file.each_line do |l|                  
      puts l
      if(l.chomp.to_s !='end')
        case i
          when 0
            unit_prop = UnitProperty.create      
            unit_prop.save!
            
            puts "'" + l + "'"
            puts Unit.count.to_s   
            puts Unit.find_by_name(l.chomp.to_s)                       
            u = Unit.find_by_name(l.chomp.to_s)
            u.unit_property_id = unit_prop.id
            u.save!                      
            unit_prop.unit_id = u.id
            puts unit_prop.unit.to_s
          when 1 
            puts unit_prop.to_s
            unit_prop.strength = l.to_i
          when 2
            unit_prop.range_strength = l.to_i
          when 3
            unit_prop.range_attack = l.to_i
          when 4
            unit_prop.range_move = l.to_i
          when 5
            unit_prop.armor = l.to_i
          when 6
            unit_prop.price = l.to_i
          when 7
            unit_prop.hp = l.to_i
          when 8
            unit_prop.is_flying = l.to_i
          when 9
            unit_prop.is_shooting = l.to_i
        end
        i += 1
      else
        i = 0
        puts "jednostka przy zapisie   " + unit_prop.unit.to_s
        unit_prop.save!
      end      
    end
    file.close
  end
  
  desc('Creating terrain properties')
  task(:terrain_properties_create => :environment) do     
    
    TerrainProperty.delete_all#debug
    terr_prop = nil
    t = nil
    join_with_t = false
    Dir.chdir(Dir.pwd + "/public/properties/")    
    file = File.new("terrain_properties.txt")
    i = 0
    file.each_line do |l|                  
      puts l
      if(l.chomp.to_s == '---')
        join_with_t = true
      end
      if(!join_with_t)
              if(l.chomp.to_s !='end')
                case i
                  when 0
                    terr_prop = TerrainProperty.create      
                    terr_prop.name = l.chomp.to_s
                  when 1 
                    puts terr_prop.to_s
                    terr_prop.can_move = l.to_i
                  when 2
                    terr_prop.move_ratio = l.to_i
                  when 3
                    terr_prop.defend_rate = l.to_i
                  when 4
                    terr_prop.is_mine = l.to_i
                  when 5
                    terr_prop.gold_per_turn = l.to_i
                end
                i += 1
              else
                i = 0
                puts "terrain prop przy zapisie   " + terr_prop.to_s
                terr_prop.save!
              end 
      else
        if(l.chomp.to_s != '---')
          pop_t_terr = l.split(" ")
          puts pop_t_terr[0].to_s
          puts pop_t_terr.to_s
          t = Terrain.find_by_short_name(pop_t_terr[0])
          puts t
          terr_p = TerrainProperty.find_by_name(pop_t_terr[1])
          puts 'terr_p = ' + pop_t_terr[1]
          t.terrain_property = terr_p
          t.save!
          terr_p.terrains << t
          terr_p.save!
        end
      end
    end
    file.close
  end
end