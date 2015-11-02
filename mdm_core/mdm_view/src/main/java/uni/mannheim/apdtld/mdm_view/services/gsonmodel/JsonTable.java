package uni.mannheim.apdtld.mdm_view.services.gsonmodel;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

public class JsonTable {
	
	public String name;
	public List<Attribute> all;
	public List<Attribute> attributes_0;
	public List<Attribute> attributes_1;
	public List<Attribute> attributes_2;
	public List<Attribute> attributes_3;
	public HashMap<String, JsonTable> subtables = new HashMap<>();
	
	public List<Attribute> getAttributes() throws Exception {
		if(all==null) {
			all = new ArrayList<>();
			all.addAll(attributes_0);
			all.addAll(attributes_1);
			all.addAll(attributes_2);
			all.addAll(attributes_3);
			Iterator<Attribute> it = all.iterator();
			subtables = new HashMap<>();
			while(it.hasNext()) {
				Attribute attr = it.next();
				String[] parts = attr.name.split("\\.");
				if(parts.length>1) {
					JsonTable subtable = this.subtables.get(parts[0]);
					if(subtable == null) {
						subtable = new JsonTable();
						subtable.name = parts[0];
						subtable.all = new ArrayList<>();
						this.subtables.put(subtable.name, subtable);
					}
					attr.name = parts[1];
					subtable.all.add(attr);
					it.remove();
				}
			}
			
		}
		return all;
	}

}
