package uni.mannheim.apdtld.mdm_model.persistence;

import java.io.Serializable;
import java.util.Calendar;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 * Entity Lead.
 * 
 * @author APDTLD_MDM @ Uni Mannheim
 * @version 23.10.2015
 */
@Entity
public class Lead implements Serializable {

	// constants
	private static final long serialVersionUID = 1L;

	// attributes
	@Id
	@GeneratedValue
	private int id;
	//@OneToOne
	//@JoinColumn
	private int customer;
	private String description;
	@Temporal(TemporalType.DATE)
	private Calendar contactOn;
	private String status;
	private String campaign;
	//@OneToOne
	//@JoinColumn
	private int product;
	private int amount;

	/**
	 * Constructor
	 */
	public Lead() {

	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
	
	public String getCampaign() {
		return campaign;
	}

	public void setCampaign(String campaign) {
		this.campaign = campaign;
	}

	public int getCustomer() {
		return customer;
	}

	public void setCustomer(int customer) {
		this.customer = customer;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Calendar getContactOn() {
		return contactOn;
	}

	public void setContactOn(Calendar contactOn) {
		this.contactOn = contactOn;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public int getProduct() {
		return product;
	}

	public void setProduct(int product) {
		this.product = product;
	}

	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}
}