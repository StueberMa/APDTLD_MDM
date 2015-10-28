package uni.mannheim.apdtld.mdm_view.services.gsonmodel;

public class Mapping {
	
	public String fName;
	public String fType;
	public String dbName;
	
	@Override
	public String toString() {
		return fName + ", " + fType + ", " + dbName;
	}

}
