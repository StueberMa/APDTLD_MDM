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
 * Entity Campaign.
 * 
 * @author APDTLD_MDM @ Uni Mannheim
 * @version 23.10.2015
 */
@Entity
public class Campaign implements Serializable {

	// constants
		private static final long serialVersionUID = 1L;

	// attributes
	@Id
	@GeneratedValue
	@Column(name="ID")
	private String id;
	private String name;
	private String type;
	private String description;
	private String status;
	
	@Temporal(TemporalType.DATE)
	private Calendar startDate;
	@Temporal(TemporalType.DATE)
	private Calendar endDate;
	private double plannedCosts;
	private double costs;
	private int numberSend;
	private int plannedReceived;
	
	private int numberReceived;
	private int numberLeads;
	private int numberOpport;
	private double valueOpport;
	
	/**
	 * Constructor
	 */
	public Campaign() {
		
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
	 * GET type
	 * 
	 * @return
	 */
	public String getType() {
		return type;
	}
	
	/**
	 * SET type
	 * 
	 * @param type
	 */
	public void setType(String type) {
		this.type = type;
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
	 * GET startDate
	 * 
	 * @return
	 */
	public Calendar getStartDate() {
		return startDate;
	}
	
	/**
	 * SET startDate
	 * 
	 * @param startDate
	 */
	public void setStartDate(Calendar startDate) {
		this.startDate = startDate;
	}
	
	/**
	 * GET endDate
	 * 
	 * @return
	 */
	public Calendar getEndDate() {
		return endDate;
	}
	
	/**
	 * SET endDate
	 * 
	 * @param endDate
	 */
	public void setEndDate(Calendar endDate) {
		this.endDate = endDate;
	}
	
	/**
	 * GET plannedCosts
	 * 
	 * @return
	 */
	public double getPlannedCosts() {
		return plannedCosts;
	}
	
	/**
	 * SET plannedCosts
	 * 
	 * @param plannedCosts
	 */
	public void setPlannedCosts(double plannedCosts) {
		this.plannedCosts = plannedCosts;
	}
	
	/**
	 * GET costs
	 * 
	 * @return
	 */
	public double getCosts() {
		return costs;
	}
	
	/**
	 * SET costs
	 * 
	 * @param costs
	 */
	public void setCosts(double costs) {
		this.costs = costs;
	}
	
	/**
	 * GET numberSend
	 * @return
	 */
	public int getNumberSend() {
		return numberSend;
	}
	
	/**
	 * SET numberSend
	 * 
	 * @param numberSend
	 */
	public void setNumberSend(int numberSend) {
		this.numberSend = numberSend;
	}
	
	/**
	 * GET plannedReceived
	 * 
	 * @return
	 */
	public int getPlannedReceived() {
		return plannedReceived;
	}
	
	/**
	 * SET plannedReceived
	 * 
	 * @param plannedReceived
	 */
	public void setPlannedReceived(int plannedReceived) {
		this.plannedReceived = plannedReceived;
	}

	/**
	 * GET numberReceived
	 * 
	 * @return
	 */
	public int getNumberReceived() {
		return numberReceived;
	}

	/**
	 * SET numberReceived
	 * 
	 * @param numberReceived
	 */
	public void setNumberReceived(int numberReceived) {
		this.numberReceived = numberReceived;
	}

	/**
	 * GET numberLeads
	 * 
	 * @return
	 */
	public int getNumberLeads() {
		return numberLeads;
	}

	/**
	 * SET numberLeads
	 * 
	 * @param numberLeads
	 */
	public void setNumberLeads(int numberLeads) {
		this.numberLeads = numberLeads;
	}

	/**
	 * GET numberOpport
	 * 
	 * @return
	 */
	public int getNumberOpport() {
		return numberOpport;
	}

	/**
	 * SET numberOpport
	 * 
	 * @param numberOpport
	 */
	public void setNumberOpport(int numberOpport) {
		this.numberOpport = numberOpport;
	}

	/**
	 * GET valueOpport
	 * 
	 * @return
	 */
	public double getValueOpport() {
		return valueOpport;
	}

	/**
	 * SET valueOpport
	 * @param valueOpport
	 */
	public void setValueOpport(double valueOpport) {
		this.valueOpport = valueOpport;
	}
}
