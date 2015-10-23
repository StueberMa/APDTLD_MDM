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
 * Entity Customer.
 * 
 * @author APDTLD_MDM @ Uni Mannheim
 * @version 25.09.2015
 */
@Entity
public class Customer implements Serializable {
	
	// constants
	private static final long serialVersionUID = 1L;
	
	// attributes
	@Id
	@GeneratedValue
	@Column(name="CustomerId")
	private int id;
	private String title;
	private String firstName;
	private String lastName;
	private int gender;
	@Temporal(TemporalType.DATE)
	private Calendar birthDate;
	private Address address;
	private ContactDetails contactDetails;
	private PaymentDetails paymentDetails;

	/**
	 * Constructor
	 */
	public Customer() {
		
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
	 * GET firstName
	 * 
	 * @return
	 */
	public String getFirstName() {
		return firstName;
	}

	/**
	 * SET firstName
	 * 
	 * @param firstName
	 */
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	/**
	 * GET lastName
	 * 
	 * @return
	 */
	public String getLastName() {
		return lastName;
	}

	/**
	 * SET lastName
	 * 
	 * @param lastName
	 */
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	/**
	 * GET contactDetails
	 * 
	 * @return
	 */
	public ContactDetails getContactDetails() {
		return contactDetails;
	}

	/**
	 * SET contactDetails
	 * 
	 * @param contactDetails
	 */
	public void setContactDetails(ContactDetails contactDetails) {
		this.contactDetails = contactDetails;
	}

	/**
	 * GET paymentDetails
	 * 
	 * @return
	 */
	public PaymentDetails getPaymentDetails() {
		return paymentDetails;
	}

	/**
	 * SET paymentDetails
	 * 
	 * @param paymentDetails
	 */
	public void setPaymentDetails(PaymentDetails paymentDetails) {
		this.paymentDetails = paymentDetails;
	}

	/**
	 * GET title
	 * 
	 * @return
	 */
	public String getTitle() {
		return title;
	}

	/**
	 * SET title
	 * 
	 * @param title
	 */
	public void setTitle(String title) {
		this.title = title;
	}

	/**
	 * GET birthDate
	 * 
	 * @return
	 */
	public Calendar getBirthDate() {
		return birthDate;
	}
	
	/**
	 * SET birthDate
	 * 
	 * @param birthDate
	 */
	public void setBirthDate(Calendar birthDate) {
		this.birthDate = birthDate;
	}

	/**
	 * GET address
	 * 
	 * @return
	 */
	public Address getAddress() {
		return address;
	}

	/**
	 * SET address
	 * 
	 * @param address
	 */
	public void setAddress(Address address) {
		this.address = address;
	}

	/**
	 * GET gender
	 * 
	 * @return
	 */
	public int getGender() {
		return gender;
	}

	/**
	 * SET gender
	 * 
	 * @param gender
	 */
	public void setGender(int gender) {
		this.gender = gender;
	}
}