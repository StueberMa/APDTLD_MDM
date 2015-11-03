package uni.mannheim.apdtld.mdm_view.services;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import javax.naming.NamingException;
import javax.persistence.EntityManager;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import uni.mannheim.apdtld.mdm_view.odata.JpaEntityManagerFactory;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;

/**
 * Servlet for simple customer anaylsis.
 * 
 * @author APDTLD_MDM @ Uni Mannheim
 * @version 02.11.2015
 */
public class SimpleCustomerAnalysis extends HttpServlet {

	// constants
	private static final long serialVersionUID = 1L;
	private static final int ERROR_INTERNAL = 1;
	private static final int ERROR_NOT_FOUND = 2;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		// declaration
		EntityManager em = null;
		JsonParser parser = null;
		JsonObject json = null;
		PrintWriter out = null;
		Gson gson = null;

		// initialization
		gson = new Gson();
		parser = new JsonParser();
		json = new JsonObject();
		out = resp.getWriter();

		// set response
		resp.setStatus(200);
		resp.setContentType("application/json");

		// connect to JPA
		try {
			em = JpaEntityManagerFactory.getEntityManagerFactory("data_model").createEntityManager();
		} catch (NamingException | SQLException e) {
			reportError(ERROR_INTERNAL, resp);
			return;
		}

		// customers geo.
		if (req.getPathInfo().equals("/overview")) {

			// local declaration
			long value = 0;

			// countries
			value = (Long) em.createQuery("SELECT count(distinct c.address.country) FROM Customer c").getSingleResult();
			json.addProperty("countries", value);

			// customers
			value = (Long) em.createQuery("SELECT count(distinct c) FROM Customer c").getSingleResult();
			json.addProperty("customers", value);

			out.print(json.toString());
			out.close();

			return;
		}

		// customers geo.
		if (req.getPathInfo().equals("/perCountry")) {
			
			// local declaration
			JsonArray resultJson = null;
			JsonArray countries = null;
			JsonObject country = null;
			Object result = null;
			long totalCust = 0;
			long value = 0;

			// initialization
			countries = new JsonArray();
			
			// countries
			result = em.createQuery("SELECT c.address.country, count(distinct c) FROM Customer c GROUP BY c.address.country").getResultList();
			resultJson = (JsonArray) parser.parse(gson.toJson(result));
			
			// customers
			totalCust = (Long) em.createQuery("SELECT count(distinct c) FROM Customer c").getSingleResult();
			
			// compute rel. customer ratio per country
			for (int i = 0; i < resultJson.size(); i++) {
				
				country = new JsonObject();
				country.add("code", ((JsonArray) resultJson.get(i)).get(0));
				
				value = ((JsonArray) resultJson.get(i)).get(1).getAsInt();
				country.add("count", new JsonPrimitive(value));
				country.add("percentage", new JsonPrimitive((double) value / totalCust));
				country.add("total", new JsonPrimitive(totalCust));
				
				countries.add(country);
			}
			
			json.add("countries", countries);
			
			out.print(json.toString());
			out.close();

			return;
		}

		// no handler found
		reportError(ERROR_NOT_FOUND, resp);
	}

	/**
	 * Method to report error
	 * 
	 * @param type
	 * @param resp
	 */
	private void reportError(int type, HttpServletResponse resp) throws ServletException, IOException {

		// declaration
		JsonObject json = null;
		PrintWriter out = null;

		// initialization
		json = new JsonObject();
		out = resp.getWriter();

		// handle according to type
		switch (type) {
		case ERROR_INTERNAL:
			resp.setStatus(500);
			json.addProperty("error", "Internal server error");
			break;

		case ERROR_NOT_FOUND:
			resp.setStatus(404);
			json.addProperty("error", "Service not found");
			break;
		}

		out.print(json.toString());
		out.close();
	}
}
