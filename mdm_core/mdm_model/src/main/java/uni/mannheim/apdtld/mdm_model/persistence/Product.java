package uni.mannheim.apdtld.mdm_model.persistence;

import java.io.Serializable;

import javax.persistence.Column;
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
	@Column(name="ID")
	private String id;
	private String name;
	private String description;
	private String unitOfMeasure;
	private int grossWeight;
	private int netWeight;
	private String weightUnit;
	private String size;
	private String color;
	private double price;
	private String currency;
	private Procurement procurement;
	
	/**
	 * Constructor
	 */
	public Product() {
		
	}
	
	/**
	 * GET id
	 * 
	 * @return
	 */
	public String getId() {
		return id;
	}
	
	/**
	 * SET id
	 * 
	 * @param id
	 */
	public void setId(String id) {
		this.id = id;
	}

	/**
	 * GET name
	 * 
	 * @return
	 */
	public String getName() {
		return name;
	}

	/**
	 * SET name
	 * 
	 * @param name
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * GET description
	 * 
	 * @return
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * SET description
	 * 
	 * @param description
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * GET unitOfMeasure
	 * 
	 * @return
	 */
	public String getUnitOfMeasure() {
		return unitOfMeasure;
	}
	
	/**
	 * SET unitOfMeasure
	 * @param unitOfMeasure
	 */
	public void setUnitOfMeasure(String unitOfMeasure) {
		this.unitOfMeasure = unitOfMeasure;
	}

	/**
	 * GET grossWeight
	 * 
	 * @return
	 */
	public int getGrossWeight() {
		return grossWeight;
	}

	/**
	 * SET grossWeight
	 * 
	 * @param grossWeight
	 */
	public void setGrossWeight(int grossWeight) {
		this.grossWeight = grossWeight;
	}

	/**
	 * SET netWeight
	 * 
	 * @return
	 */
	public int getNetWeight() {
		return netWeight;
	}

	/**
	 * GET netWeight
	 * 
	 * @param netWeight
	 */
	public void setNetWeight(int netWeight) {
		this.netWeight = netWeight;
	}

	/**
	 * GET weightUnit
	 * @return
	 */
	public String getWeightUnit() {
		return weightUnit;
	}
	
	/**
	 * SET weightUnit
	 * 
	 * @param weightUnit
	 */
	public void setWeightUnit(String weightUnit) {
		this.weightUnit = weightUnit;
	}

	/**
	 * GET size
	 * 
	 * @return
	 */
	public String getSize() {
		return size;
	}

	/**
	 * SET size
	 * 
	 * @param size
	 */
	public void setSize(String size) {
		this.size = size;
	}

	/**
	 * GET color
	 * 
	 * @return
	 */
	public String getColor() {
		return color;
	}

	/**
	 * SET color
	 * 
	 * @param color
	 */
	public void setColor(String color) {
		this.color = color;
	}

	/**
	 * GET price
	 * 
	 * @return
	 */
	public double getPrice() {
		return price;
	}

	/**
	 * SET price
	 * 
	 * @param price
	 */
	public void setPrice(double price) {
		this.price = price;
	}

	/**
	 * GET currency
	 * 
	 * @return
	 */
	public String getCurrency() {
		return currency;
	}

	/**
	 * SET currency
	 * 
	 * @param currency
	 */
	public void setCurrency(String currency) {
		this.currency = currency;
	}

	/**
	 * GET procurement
	 * 
	 * @return
	 */
	public Procurement getProcurement() {
		return procurement;
	}

	/**
	 * SET procurement
	 * 
	 * @param procurement
	 */
	public void setProcurement(Procurement procurement) {
		this.procurement = procurement;
	}
	
}
