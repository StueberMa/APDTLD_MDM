package uni.mannheim.apdtld.mdm_model.persistence;

import java.io.Serializable;

import javax.persistence.Embeddable;

@Embeddable
public class Procurement implements Serializable {
	// constants
	private static final long serialVersionUID = 1L;
	
	private String procurementType;
	private String procurementTime;
	private String safetyStock;
	private String totalStock;
	
	public String getProcurementType() {
		return procurementType;
	}
	public void setProcurementType(String procurementType) {
		this.procurementType = procurementType;
	}
	public String getProcurementTime() {
		return procurementTime;
	}
	public void setProcurementTime(String procurementTime) {
		this.procurementTime = procurementTime;
	}
	public String getSafetyStock() {
		return safetyStock;
	}
	public void setSafetyStock(String safetyStock) {
		this.safetyStock = safetyStock;
	}
	public String getTotalStock() {
		return totalStock;
	}
	public void setTotalStock(String totalStock) {
		this.totalStock = totalStock;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}

}
