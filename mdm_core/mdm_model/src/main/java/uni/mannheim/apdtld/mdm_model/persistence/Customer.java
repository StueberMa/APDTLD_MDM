package uni.mannheim.apdtld.mdm_model.persistence;

import java.io.Serializable;
import javax.persistence.*;

/**
 * Entity Customer.
 * 
 * @author APDTLD_MDM @ Uni Mannheim
 * @version 25.09.2015
 */
@Entity
@NamedQuery(name = "AllCustomers", query = "SELECT c FROM Customer c")
public class Customer implements Serializable {

	// constants
	private static final long serialVersionUID = 1L;
	
	// attributes
	@Id @GeneratedValue private long id;
	private String firstName;
	private String lastName;

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
	public long getId() {
		return id;
	}
	
	/**
	 * Method setId
	 * 
	 * @param id
	 */
	public void setId(long id) {
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
}