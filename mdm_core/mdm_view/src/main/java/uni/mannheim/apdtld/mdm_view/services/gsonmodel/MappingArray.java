package uni.mannheim.apdtld.mdm_view.services.gsonmodel;

import java.util.HashMap;
import java.util.HashSet;

public class MappingArray {
	
	public Mapping[] mappings;
	
	public HashMap<String, HashSet<Mapping>> getMappingMap() {
		HashMap<String, HashSet<Mapping>> map = new HashMap<>();
		for(Mapping mapping:this.mappings){
			if(!map.containsKey(mapping.fName)) {
				map.put(mapping.fName, new HashSet<Mapping>());
				map.get(mapping.fName).add(mapping);
			} else {
				map.get(mapping.fName).add(mapping);
			}
		}
		return map;
	}

}
