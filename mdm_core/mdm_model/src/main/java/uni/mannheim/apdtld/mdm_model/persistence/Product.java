package uni.mannheim.apdtld.mdm_model.persistence;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 * Entity Product.
 * 
 * @author APDTLD_MDM @ Uni Mannheim
 * @version 15.10.2015
 */
@Entity
public class Product implements Serializable {
	// constants
	private static final long serialVersionUID = 1L;

	// attributes
	@Id
	@GeneratedValue
	private int id;

	private String name;
	private String description;
	private String unitOfMeasure;
	private int grossWeight;
	private int netWeight;
	private String weightUnit;
	private String size;
	private String color;
	private int price;
	private String currency;
	private Procurement procurement;
	
	/**
	 * Constructor
	 */
	public Product() {
		
	}
	
	/**
	 * Method getId
	 * 
	 * @return
	 */
	public int getId() {
		return id;
	}
	
	/**
	 * Method setId
	 * 
	 * @param id
	 */
	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String param) {
		this.name = param;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String param) {
		this.description = param;
	}

	public String getUnitOfMeasure() {
		return unitOfMeasure;
	}

	public void setUnitOfMeasure(String param) {
		this.unitOfMeasure = param;
	}

	public int getGrossWeight() {
		return grossWeight;
	}

	public void setGrossWeight(int param) {
		this.grossWeight = param;
	}

	public int getNetWeight() {
		return netWeight;
	}

	public void setNetWeight(int param) {
		this.netWeight = param;
	}

	public String getWeightUnit() {
		return weightUnit;
	}

	public void setWeightUnit(String param) {
		this.weightUnit = param;
	}

	public String getSize() {
		return size;
	}

	public void setSize(String param) {
		this.size = param;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String param) {
		this.color = param;
	}

	public int getPrice() {
		return price;
	}

	public void setPrice(int param) {
		this.price = param;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String param) {
		this.currency = param;
	}

	public Procurement getProcurement() {
		return procurement;
	}

	public void setProcurement(Procurement param) {
		this.procurement = param;
	}

}
