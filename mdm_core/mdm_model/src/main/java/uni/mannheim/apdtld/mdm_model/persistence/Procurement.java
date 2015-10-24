package uni.mannheim.apdtld.mdm_model.persistence;

import java.io.Serializable;

import javax.persistence.Embeddable;

/**
 * Embedded Procurement.
 * 
 * @author APDTLD_MDM @ Uni Mannheim
 * @version 23.10.2015
 */
@Embeddable
public class Procurement implements Serializable {
	
	// constants
	private static final long serialVersionUID = 1L;
	
	// attributes
	private String procurementType;
	private int procurementTime;
	private int safetyStock;
	private int totalStock;
	
	/**
	 * GET procurementType
	 * 
	 * @return
	 */
	public String getProcurementType() {
		return procurementType;
	}
	
	/**
	 * SET procurementType
	 * 
	 * @param procurementType
	 */
	public void setProcurementType(String procurementType) {
		this.procurementType = procurementType;
	}
	
	/**
	 * GET procurementTime
	 * 
	 * @return
	 */
	public int getProcurementTime() {
		return procurementTime;
	}
	
	/**
	 * SET procurementTime
	 * 
	 * @param procurementTime
	 */
	public void setProcurementTime(int procurementTime) {
		this.procurementTime = procurementTime;
	}
	
	/**
	 * GET safetyStock
	 * 
	 * @return
	 */
	public int getSafetyStock() {
		return safetyStock;
	}
	
	/**
	 * SET safetyStock
	 * 
	 * @param safetyStock
	 */
	public void setSafetyStock(int safetyStock) {
		this.safetyStock = safetyStock;
	}
	
	/**
	 * GET totalStock
	 * 
	 * @return
	 */
	public int getTotalStock() {
		return totalStock;
	}
	
	/**
	 * SET totalStock
	 * 
	 * @param totalStock
	 */
	public void setTotalStock(int totalStock) {
		this.totalStock = totalStock;
	}
}
