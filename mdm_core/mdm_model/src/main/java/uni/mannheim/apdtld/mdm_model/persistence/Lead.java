package uni.mannheim.apdtld.mdm_model.persistence;

import java.io.Serializable;
import java.util.Calendar;

import javax.persistence.Column;
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
	@Column(name="ID")
	private String id;
	private String description;
	@Column(name="CUSTOMERID")
	private String customerId;
	@Temporal(TemporalType.DATE)
	private Calendar contactOn;
	private String status;
	@Column(name="CAMPAIGNID")
	private String campaignId;
	@Column(name="PRODUCTID")
	private String productId;
	private double amount;

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
	 * GET campaignId
	 * 
	 * @return
	 */
	public String getCampaignId() {
		return campaignId;
	}

	/**
	 * SET campaign
	 * 
	 * @param campaignId
	 */
	public void setCampaignId(String campaignId) {
		this.campaignId = campaignId;
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
	 * GET productId
	 * 
	 * @return
	 */
	public String getProductId() {
		return productId;
	}

	/**
	 * SET product
	 * 
	 * @param productId
	 */
	public void setProductId(String productId) {
		this.productId = productId;
	}

	/**
	 * GET amount
	 * 
	 * @return
	 */
	public double getAmount() {
		return amount;
	}

	/**
	 * SET amount
	 * 
	 * @param amount
	 */
	public void setAmount(double amount) {
		this.amount = amount;
	}
	
	/**
	 * GET customerId
	 * 
	 * @return
	 */
	public String getCustomerId() {
		return customerId;
	}

	/**
	 * SET customerId
	 * 
	 * @param customerId
	 */
	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}
	
}