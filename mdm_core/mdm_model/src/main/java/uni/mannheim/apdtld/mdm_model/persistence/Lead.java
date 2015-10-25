package uni.mannheim.apdtld.mdm_model.persistence;

import java.io.Serializable;
import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import uni.mannheim.apdtld.mdm_model.persistence.Customer;

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
	@Column(name="id")
	private int id;
	private String description;
	@Column(name="customerId")
	private int customerId;
	@Temporal(TemporalType.DATE)
	private Calendar contactOn;
	private String status;
	private String campaign;
	private int product;
	private int amount;

	@ManyToOne(fetch=FetchType.EAGER)
	@JoinColumn(name="customerId", referencedColumnName="id", insertable=false, updatable=false)
	private Customer customer;

	/**
	 * Constructor
	 */
	public Lead() {

	}

	/**
	 * GET id
	 * 
	 * @return
	 */
	public int getId() {
		return id;
	}

	/**
	 * SET id
	 * 
	 * @param id
	 */
	public void setId(int id) {
		this.id = id;
	}
	
	/**
	 * GET campaign
	 * 
	 * @return
	 */
	public String getCampaign() {
		return campaign;
	}

	/**
	 * SET campaign
	 * 
	 * @param campaign
	 */
	public void setCampaign(String campaign) {
		this.campaign = campaign;
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
	 * GET contactOn
	 * 
	 * @return
	 */
	public Calendar getContactOn() {
		return contactOn;
	}

	/**
	 * SET contactOn
	 * 
	 * @param contactOn
	 */
	public void setContactOn(Calendar contactOn) {
		this.contactOn = contactOn;
	}

	/**
	 * GET status
	 * 
	 * @return
	 */
	public String getStatus() {
		return status;
	}

	/**
	 * SET status
	 * 
	 * @param status
	 */
	public void setStatus(String status) {
		this.status = status;
	}

	/**
	 * GET product
	 * 
	 * @return
	 */
	public int getProduct() {
		return product;
	}

	/**
	 * SET product
	 * 
	 * @param product
	 */
	public void setProduct(int product) {
		this.product = product;
	}

	/**
	 * GET amount
	 * 
	 * @return
	 */
	public int getAmount() {
		return amount;
	}

	/**
	 * SET amount
	 * 
	 * @param amount
	 */
	public void setAmount(int amount) {
		this.amount = amount;
	}

	/**
	 * GET customer
	 * 
	 * @return
	 */
	public Customer getCustomer() {
	    return customer;
	}

	/**
	 * SET customer
	 * 
	 * @param customer
	 */
	public void setCustomer(Customer customer) {
	    this.customer = customer;
	}

	/**
	 * GET customerId
	 * 
	 * @return
	 */
	public int getCustomerId() {
		return customerId;
	}

	/**
	 * SET customerId
	 * 
	 * @param customerId
	 */
	public void setCustomerId(int customerId) {
		this.customerId = customerId;
	}
}