package uni.mannheim.apdtld.mdm_view.services;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.Serializable;
import java.io.Writer;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.naming.NamingException;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import javax.persistence.PersistenceUnit;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.persistence.metamodel.Attribute;
import javax.persistence.metamodel.EmbeddableType;
import javax.persistence.metamodel.EntityType;
import javax.persistence.metamodel.ManagedType;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transaction;

import org.apache.commons.lang3.StringUtils;

import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.opencsv.CSVReader;
import com.opencsv.CSVWriter;

import uni.mannheim.apdtld.mdm_model.persistence.Customer;
import uni.mannheim.apdtld.mdm_view.odata.JpaEntityManagerFactory;
import uni.mannheim.apdtld.mdm_view.odata.ODataJPAServiceFactory;
import uni.mannheim.apdtld.mdm_view.services.gsonmodel.DatabaseTables;
import uni.mannheim.apdtld.mdm_view.services.gsonmodel.JsonTable;
import uni.mannheim.apdtld.mdm_view.services.gsonmodel.Mapping;
import uni.mannheim.apdtld.mdm_view.services.gsonmodel.MappingArray;

public class Exporter extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static HashMap<Long, String> requests = new HashMap<>();
	private HashSet<Table> tables = null;
	
	public void init() {
		requests.put(1L, "{'database_tables':[{'name':'Campaign','attributes_0':[{'name':'costs','selected':'true'},{'name':'name','selected':'true'},{'name':'numberSend','selected':'true'},{'name':'status','selected':'true'}],'attributes_1':[{'name':'description','selected':'true'},{'name':'numberLeads','selected':'true'},{'name':'plannedCosts','selected':'true'},{'name':'type','selected':'true'}],'attributes_2':[{'name':'endDate','selected':'true'},{'name':'numberOpport','selected':'true'},{'name':'plannedReceived','selected':'true'},{'name':'valueOpport','selected':'true'}],'attributes_3':[{'name':'id','selected':'true'},{'name':'numberReceived','selected':'true'},{'name':'startDate','selected':'true'}]},{'name':'Customer','attributes_0':[{'name':'Address.city','selected':'true'},{'name':'Address.zipCode','selected':'true'},{'name':'ContactDetails.mobile','selected':'true'},{'name':'PaymentDetails.iban','selected':'true'},{'name':'id','selected':'true'}],'attributes_1':[{'name':'Address.country','selected':'true'},{'name':'ContactDetails.email','selected':'true'},{'name':'ContactDetails.phone','selected':'true'},{'name':'birthDate','selected':'true'},{'name':'lastName','selected':'true'}],'attributes_2':[{'name':'Address.houseNo','selected':'true'},{'name':'ContactDetails.facebook','selected':'true'},{'name':'PaymentDetails.bankAccount','selected':'true'},{'name':'firstName','selected':'true'},{'name':'title','selected':'true'}],'attributes_3':[{'name':'Address.street','selected':'true'},{'name':'ContactDetails.fax','selected':'true'},{'name':'PaymentDetails.bic','selected':'true'},{'name':'gender','selected':'true'}]},{'name':'Lead','attributes_0':[{'name':'amount','selected':'true'},{'name':'description','selected':'true'}],'attributes_1':[{'name':'campaignId','selected':'true'},{'name':'id','selected':'true'}],'attributes_2':[{'name':'contactOn','selected':'true'},{'name':'productId','selected':'true'}],'attributes_3':[{'name':'customerId','selected':'true'},{'name':'status','selected':'true'}]},{'name':'Product','attributes_0':[{'name':'Procurement.procurementTime','selected':'true'},{'name':'color','selected':'true'},{'name':'id','selected':'true'},{'name':'size','selected':'true'}],'attributes_1':[{'name':'Procurement.procurementType','selected':'true'},{'name':'currency','selected':'true'},{'name':'name','selected':'true'},{'name':'unitOfMeasure','selected':'true'}],'attributes_2':[{'name':'Procurement.safetyStock','selected':'true'},{'name':'description','selected':'true'},{'name':'netWeight','selected':'true'},{'name':'weightUnit','selected':'true'}],'attributes_3':[{'name':'Procurement.totalStock','selected':'true'},{'name':'grossWeight','selected':'true'},{'name':'price','selected':'true'}]}]}");
	}
		
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
	
		StringBuffer jb = new StringBuffer();
		String line = null;
		try {
			BufferedReader reader = request.getReader();
			while ((line = reader.readLine()) != null)
				jb.append(line);
		} catch (Exception e) { /*report an error*/ }
		
		response.setContentType("application/json");
		
		JsonObject json = new JsonObject();
		Writer out = response.getWriter();
		
		Long id = (long)(Math.random() * System.currentTimeMillis());
		requests.put(id, jb.toString());
		
		json.addProperty("id", id);
		
		out.write(json.toString());
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		if(request.getParameter("download")!=null) {
			this.processExportToFileReqeust(request, response);
		} else {
			this.processGetExportTablesRequest(request, response);
		}
	}
	
	private void processExportToFileReqeust(HttpServletRequest request, HttpServletResponse response) throws IOException {
		
		Long id = Long.parseLong(request.getParameter("download"));
		String jsonRequest = requests.get(id);
		Writer out = response.getWriter();
        response.setContentType("plain/text");
        response.setHeader("Content-disposition","attachment; filename=export.csv");
        
        DatabaseTables root = new GsonBuilder().create().fromJson(jsonRequest, DatabaseTables.class);
        
        CSVWriter writer = new CSVWriter(out);
        
        EntityManagerFactory fac;
		try {
			fac = JpaEntityManagerFactory.getEntityManagerFactory("data_model");
			EntityManager em = fac.createEntityManager();
			
			for(JsonTable table:root.database_tables) {
				
				writer.writeNext(new String[]{table.name});
				ArrayList<String> strrow = new ArrayList<>();
				table.getAttributes();
				for(uni.mannheim.apdtld.mdm_view.services.gsonmodel.Attribute attr:table.getAttributes()) {
					if(!attr.selected) {
						continue;
					}
					strrow.add(attr.name);
				}
				writer.writeNext(strrow.toArray(new String[]{}));
					

				
				List<?> rows = em.createQuery("Select t From " + table.name + " t")
						.getResultList();

				for(Object row:rows) {
					strrow = new ArrayList<>();
					Class<?> c = row.getClass();
					for(uni.mannheim.apdtld.mdm_view.services.gsonmodel.Attribute attr:table.getAttributes()) {
						if(!attr.selected) {
							continue;
						}
						Field f = c.getDeclaredField(attr.name);
						boolean acc = f.isAccessible();
						f.setAccessible(true);
						if(f.get(row)!=null) {
							Object o = f.get(row);
							if(o instanceof GregorianCalendar) {
								GregorianCalendar greg = (GregorianCalendar)o;
								SimpleDateFormat fmt = new SimpleDateFormat("dd-MM-yyyy");
							    fmt.setCalendar(greg);
							    String dateFormatted = fmt.format(greg.getTime());
								strrow.add(dateFormatted);
							} else {
								strrow.add(f.get(row).toString());
							}
						} else {
							strrow.add("");
						}
						f.setAccessible(acc);
					}
					writer.writeNext(strrow.toArray(new String[]{}));
				}
				writer.writeNext(new String[]{});
			}
		} catch(Exception ex) {
			out.write("error");
			out.write(ex.getMessage());
			out.write(ex.getStackTrace().toString());
		}
				
		writer.close();
	}
	
	private void processGetExportTablesRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.setContentType("application/json");
		
		JsonObject json = new JsonObject();
		Writer out = response.getWriter();
		
		this.analyseDatabaseStructure();
						
		JsonArray jsonTables = new JsonArray();
		List<Table> sortedTables = asSortedList(this.tables);
		for(Table table:sortedTables) {
			JsonObject jsonTable = new JsonObject();
			jsonTable.addProperty("name", table.getName());
			JsonArray[] jsonAttributes = new JsonArray[4];
			jsonAttributes[0] = new JsonArray();
			jsonAttributes[1] = new JsonArray();
			jsonAttributes[2] = new JsonArray();
			jsonAttributes[3] = new JsonArray();
			int i=0;
			List<String> sortedKeys = asSortedList(table.getAttributeInfo().keySet());
			for(String key:sortedKeys) {
				JsonObject jsonAttribute = new JsonObject();
				jsonAttribute.addProperty("name", key);
				jsonAttribute.addProperty("selected", "true");
				jsonAttributes[i++%4].add(jsonAttribute);
			}
			jsonTable.add("attributes_0", jsonAttributes[0]);
			jsonTable.add("attributes_1", jsonAttributes[1]);
			jsonTable.add("attributes_2", jsonAttributes[2]);
			jsonTable.add("attributes_3", jsonAttributes[3]);
			jsonTables.add(jsonTable);
		}
		
		json.add("database_tables", jsonTables);
		out.write(json.toString());
	}
	
	private void analyseDatabaseStructure() {
		this.tables = new HashSet<Table>();
		
		HashMap<String, Table> embedables = new HashMap<>();
		
		try {
			EntityManagerFactory fac = JpaEntityManagerFactory.getEntityManagerFactory("data_model");
			
			Set<EmbeddableType<?>> embeddables = fac.getMetamodel().getEmbeddables();
			Iterator<EmbeddableType<?>> it2 = embeddables.iterator();
			while(it2.hasNext()) {
				EmbeddableType<?> o = it2.next();
				String[] fullyQualifiedNameParts = o.getJavaType().getName().split("\\.");
				String name = fullyQualifiedNameParts[fullyQualifiedNameParts.length-1];
				Table table = new Table(name);
				for(Attribute<?,?> attr : o.getAttributes()) {
					String type = attr.getJavaType().getName();
					if(type.indexOf("String")>0) {
						type = "Text";
					} else if(type.indexOf("int")>=0 || type.indexOf("float")>=0 || type.indexOf("double")>=0) {
						type = "Number";
					} else if(type.equals("java.util.Calendar")) {
						type = "Date";
					} else {
						type = "ref";
					}
					
					String sample = "";
					/*List<?> rows = fac.createEntityManager()
							.createQuery("Select t From " + o.getName() + " t")
							//.setMaxResults(10)
							.getResultList();

					for(Object row:rows) {
						Class<?> c = row.getClass();
						Field f = c.getDeclaredField(attr.getName());
						boolean acc = f.isAccessible();
						f.setAccessible(true);
						sample += f.get(row) + "; ";
						f.setAccessible(acc);
					}*/
					
					if(!type.equals("ref")) {
						table.addAttribute(attr.getName(), type, sample);
					}
				}
				embedables.put(name, table);
			}
			
			//EntityManager em = fac.createEntityManager();
			Set<EntityType<?>> entities = fac.getMetamodel().getEntities();
			Iterator<EntityType<?>> it = entities.iterator();
			while(it.hasNext()) {
				EntityType<?> o = it.next();
				Table table = new Table(o.getName());
				for(Attribute<?,?> attr : o.getAttributes()) {
					String type = attr.getJavaType().getName();
					if(type.indexOf("String")>0) {
						type = "Text";
					} else if(type.indexOf("int")>=0 || type.indexOf("float")>=0 || type.indexOf("double")>=0) {
						type = "Number";
					} else if(type.equals("java.util.Calendar")) {
						type = "Date";
					} else {
						String[] fullyQualifiedNameParts = type.split("\\.");
						String name = fullyQualifiedNameParts[fullyQualifiedNameParts.length-1];
						if(embedables.containsKey(name)) {
							Table embeddedTable = embedables.get(name);
							for(AttributeTupel attribute:embeddedTable.getAttributeInfo().values()) {
								table.addAttribute(name + "." + attribute.name, attribute.type, attribute.sample);
							}
						}
						type = "ref";
					}

					String sample = "";
					List<?> rows = fac.createEntityManager()
							.createQuery("Select t From " + o.getName() + " t")
							//.setMaxResults(10)
							.getResultList();

					for(Object row:rows) {
						Class<?> c = row.getClass();
						Field f = c.getDeclaredField(attr.getName());
						boolean acc = f.isAccessible();
						f.setAccessible(true);
						sample += f.get(row) + "; ";
						f.setAccessible(acc);
					}
					
					if(!type.equals("ref")) {
						table.addAttribute(attr.getName(), type, sample);
					}
				}
				this.tables.add(table);
			}
		} catch (NamingException e) {
		} catch (SQLException e) {
		} catch (Exception e) {
		}
	}
	
	private String shortenSample(String sample) {
		if(sample.length()>15) {
			return sample.substring(0, 15) + "...";
		} else if(sample.length()>2){
			return sample;
		} else {
			return "";
		}
	}
	
	public static 	<T extends Comparable<? super T>> List<T> asSortedList(Collection<T> c) {
		List<T> list = new ArrayList<T>(c);
		java.util.Collections.sort(list);
		return list;
	}
}
