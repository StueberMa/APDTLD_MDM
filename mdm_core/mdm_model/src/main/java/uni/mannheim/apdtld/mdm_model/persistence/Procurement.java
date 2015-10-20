package uni.mannheim.apdtld.mdm_model.persistence;

import java.io.Serializable;

import javax.persistence.Embeddable;

@Embeddable
public class Procurement implements Serializable {
	
	// constants
	private static final long serialVersionUID = 1L;
	
	// attributes
	private String procurementType;
	private int procurementTime;
	private int safetyStock;
	private int totalStock;
	
	public String getProcurementType() {
		return procurementType;
	}
	
	public void setProcurementType(String procurementType) {
		this.procurementType = procurementType;
	}
	
	public int getProcurementTime() {
		return procurementTime;
	}
	
	public void setProcurementTime(int procurementTime) {
		this.procurementTime = procurementTime;
	}
	
	public int getSafetyStock() {
		return safetyStock;
	}
	
	public void setSafetyStock(int safetyStock) {
		this.safetyStock = safetyStock;
	}
	
	public int getTotalStock() {
		return totalStock;
	}
	
	public void setTotalStock(int totalStock) {
		this.totalStock = totalStock;
	}
}
