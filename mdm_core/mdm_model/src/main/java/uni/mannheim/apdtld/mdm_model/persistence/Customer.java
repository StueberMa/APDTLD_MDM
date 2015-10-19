package uni.mannheim.apdtld.mdm_model.persistence;

import java.io.Serializable;
import java.util.Calendar;

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
	@Id @GeneratedValue private int id;
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

	/**
	 * Method getFirstName
	 * 
	 * @return
	 */
	public String getFirstName() {
		return firstName;
	}

	/**
	 * Method setFirstName
	 * 
	 * @param param
	 */
	public void setFirstName(String param) {
		this.firstName = param;
	}

	/**
	 * Method getLastName
	 * 
	 * @return
	 */
	public String getLastName() {
		return lastName;
	}

	/**
	 * Method setLastName
	 * 
	 * @param param
	 */
	public void setLastName(String param) {
		this.lastName = param;
	}

	public ContactDetails getContactDetails() {
		return contactDetails;
	}

	public void setContactDetails(ContactDetails contactDetails) {
		this.contactDetails = contactDetails;
	}

	public PaymentDetails getPaymentDetails() {
		return paymentDetails;
	}

	public void setPaymentDetails(PaymentDetails paymentDetails) {
		this.paymentDetails = paymentDetails;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Calendar getBirthDate() {
		return birthDate;
	}

	public void setBirthDate(Calendar birthDate) {
		this.birthDate = birthDate;
	}

	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	public int getGender() {
		return gender;
	}

	public void setGender(int gender) {
		this.gender = gender;
	}
}