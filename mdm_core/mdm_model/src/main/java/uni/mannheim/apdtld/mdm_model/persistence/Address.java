package uni.mannheim.apdtld.mdm_model.persistence;

import java.io.Serializable;

import javax.persistence.Embeddable;

/**
 * Embedded Address.
 * 
 * @author APDTLD_MDM @ Uni Mannheim
 * @version 23.10.2015
 */
@Embeddable
public class Address implements Serializable {
	
	// constants
	private static final long serialVersionUID = 1L;
	
	// attributes
	private String street;
	private String houseNo;
	private String zipCode;
	private String city;
	private String country;	
	
	/**
	 * GET street
	 * 
	 * @return
	 */
	public String getStreet() {
		return street;
	}
	
	/**
	 * SET street
	 * 
	 * @param street
	 */
	public void setStreet(String street) {
		this.street = street;
	}
	
	/**
	 * GET houseNo
	 * @return
	 */
	public String getHouseNo() {
		return houseNo;
	}
	
	/**
	 * SET houseNo
	 * 
	 * @param houseNo
	 */
	public void setHouseNo(String houseNo) {
		this.houseNo = houseNo;
	}
	
	/**
	 * GET city
	 * 
	 * @return
	 */
	public String getCity() {
		return city;
	}
	
	/**
	 * SET city
	 * 
	 * @param city
	 */
	public void setCity(String city) {
		this.city = city;
	}
	
	/**
	 * GET country
	 * 
	 * @return
	 */
	public String getCountry() {
		return country;
	}
	
	/**
	 * SET country
	 * 
	 * @param country
	 */
	public void setCountry(String country) {
		this.country = country;
	}
	
	/**
	 * GET zipCode
	 * 
	 * @return
	 */
	public String getZipCode() {
		return zipCode;
	}
	
	/**
	 * SET zipCode
	 * 
	 * @param zipCode
	 */
	public void setZipCode(String zipCode) {
		this.zipCode = zipCode;
	}
}
