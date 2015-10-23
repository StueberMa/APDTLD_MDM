package uni.mannheim.apdtld.mdm_model.persistence;

import java.io.Serializable;
import java.util.Calendar;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
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
	@OneToOne
	@JoinColumn
	private Customer customer;
	private String description;
	@Temporal(TemporalType.DATE)
	private Calendar contactOn;
	private String status;
	private String campaign;
	@OneToOne
	@JoinColumn
	private Product product;
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

	public Customer getCustomer() {
		return customer;
	}

	public void setCustomer(Customer customer) {
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

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}
}