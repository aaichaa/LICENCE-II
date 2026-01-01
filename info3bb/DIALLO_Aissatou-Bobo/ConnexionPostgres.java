import java.sql.*;
import java.util.Scanner;

public class ConnexionPostgres {

    // ======== Configuration connexion ========
    private static final String URL = "jdbc:postgresql://kafka.iem/ad057513";
    private static final String USER = "ad057513";     
    private static final String PASSWORD = "ad057513";  

    public static void main(String[] args) {

        try (Scanner sc = new Scanner(System.in)) {

            // Etape 1 : charger le driver
            Class.forName("org.postgresql.Driver");

            // Etape 2 : etablir la connexion (1 seule connexion pour tout le menu)
            try (Connection connexion = DriverManager.getConnection(URL, USER, PASSWORD)) {
                System.out.println("Connexion reussie !");
                System.out.println();

                int choix;
                do {
                    afficherMenu();
                    System.out.print("Votre choix : ");
                    while (!sc.hasNextInt()) {
                        System.out.println("Veuillez entrer un nombre.");
                        sc.next();
                        System.out.print("Votre choix : ");
                    }
                    choix = sc.nextInt();

                    switch (choix) {
                        case 1:
                            executerQuestion1(connexion);
                            break;
                        case 2:
                            executerQuestion2(connexion, sc);
                            break;
                        case 3:
                            executerQuestion3(connexion);
                            break;
                        case 4:
                            executerQuestion4(connexion, sc);
                            break;
                        case 5:
                            executerQuestion5(connexion);
                            break;
                        case 0:
                            System.out.println("Fin du programme ");
                            break;
                        default:
                            System.out.println("Choix invalide ");
                    }

                    if (choix != 0) {
                        System.out.println();
                    }

                } while (choix != 0);

            } catch (SQLException e) {
                System.out.println("Erreur SQL !");
                e.printStackTrace();
            }

        } catch (ClassNotFoundException e) {
            System.out.println("Erreur : Driver PostgreSQL introuvable !");
            e.printStackTrace();
        }
    }

    // ****************** MENU ***********************
    private static void afficherMenu() {
        System.out.println("***** MENU ****");
        System.out.println("1: A propos de la maintenance des machine");
        System.out.println("2: Liste des seances qu'un client a beneficie");
        System.out.println("3: Liste des clients qui n'ont pas participe ou a peu de seances");
        System.out.println("4: Liste des clients qui auraient ete financierement avantageux en souscrivant un abonnement");
        System.out.println("5: Liste des coachs les plus sollicites");
        System.out.println("0: Quitter");
        System.out.println("------------------------");
    }

    //*****************************
    // QUESTION 1
    // Machines dont la prochaine maintenance tombe dans un delai d'un mois
    // *****************************
    private static void executerQuestion1(Connection connexion) {
        String q1 = "SELECT "
                        + "    m.id AS machine_id, "
                        + "    m.nom AS machine_nom, "
                        + "    MAX(maint.date_maintenance) AS derniere_maintenance, "
                        + "    MAX(maint.date_maintenance) + tm.intervalle_revision * INTERVAL '1 day' AS prochaine_maintenance "
                        + "FROM sds.machine m "
                        + "JOIN sds.type_machine tm ON m.type_machine_id = tm.id "
                        + "JOIN sds.maintenance maint ON maint.machine_id = m.id "
                        + "GROUP BY m.id, m.nom, tm.intervalle_revision "
                        + "HAVING (MAX(maint.date_maintenance) + tm.intervalle_revision * INTERVAL '1 day') "
                        + "       BETWEEN DATE '2025-12-12' AND DATE '2026-01-12' "
                        + "ORDER BY m.id;";

        try (Statement statement = connexion.createStatement();
             ResultSet rs = statement.executeQuery(q1)) {

            System.out.printf(
                    "%-10s | %-12s | %-20s | %-22s%n",
                    "machine_id", "machine_nom", "derniere_maintenance", "prochaine_maintenance"
            );
            System.out.println("--------------------------------------------------------------------------");

            while (rs.next()) {
                System.out.printf(
                        "%-10d | %-12s | %-20s | %-22s%n",
                        rs.getInt("machine_id"),
                        rs.getString("machine_nom"),
                        rs.getDate("derniere_maintenance"),
                        rs.getTimestamp("prochaine_maintenance")
                );
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // **************************
    // QUESTION 2
    // Liste des seances (specialisee + coaching) qu'un client a beneficie
    // ***************************
    private static void executerQuestion2(Connection connexion, Scanner sc) {
        System.out.print("Entrez l'id du client : ");
        while (!sc.hasNextInt()) {
            System.out.println("Veuillez entrer un entier.");
            sc.next();
            System.out.print("Entrez l'id du client : ");
        }
        int clientId = sc.nextInt();

        String q2 = "SELECT 'specialisee' AS type, ss.date_seance, ss.theme, ss.duree " +
                "FROM sds.inscription_seance_specialisee iss " +
                "JOIN sds.seance_specialisee ss ON ss.id = iss.seance_specialisee_id " +
                "WHERE iss.client_id = ? " +
                "UNION ALL " +
                "SELECT 'coaching' AS type, sc.date_seance, 'Coaching' AS theme, sc.duree " +
                "FROM sds.seance_coaching sc " +
                "WHERE sc.client_id = ? " +
                "ORDER BY date_seance;";

        try (PreparedStatement ps = connexion.prepareStatement(q2)) {
            ps.setInt(1, clientId);
            ps.setInt(2, clientId);

            try (ResultSet rs = ps.executeQuery()) {
                System.out.printf("%-12s | %-15s | %-20s | %-6s%n",
                        "type", "date_seance", "theme", "duree");
                System.out.println("---------------------------------------------------------------");

                while (rs.next()) {
                    System.out.printf("%-12s | %-15s | %-20s | %-6d%n",
                            rs.getString("type"),
                            rs.getDate("date_seance"),
                            rs.getString("theme"),
                            rs.getInt("duree"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // ********************
    // QUESTION 3
    // Clients abonnes avec seance specialisee incluse sur leur periode d’abonnement
    // *********************
    private static void executerQuestion3(Connection connexion) {
        String q3 = "SELECT " +
                "  c.id, " +
                "  c.nom, " +
                "  c.prenom, " +
                "  COUNT(ss.id) AS nb_seances_inclues " +
                "FROM sds.client c " +
                "JOIN sds.abonnement a ON a.client_id = c.id " +
                "JOIN sds.abonnement_prestation ap ON ap.id_abonnement = a.id " +
                "JOIN sds.prestation p ON p.id = ap.id_prestation " +
                "  AND p.type_prestation = 'Seances specialisees' " +
                "LEFT JOIN sds.inscription_seance_specialisee iss ON iss.client_id = c.id " +
                "LEFT JOIN sds.seance_specialisee ss ON ss.id = iss.seance_specialisee_id " +
                "  AND ss.date_seance BETWEEN a.date_debut AND a.date_fin " +
                "  AND iss.montant = 0 " +
                "GROUP BY c.id, c.nom, c.prenom " +
                "HAVING COUNT(ss.id) <= 1 " +
                "ORDER BY c.id;";

        try (Statement statement = connexion.createStatement();
             ResultSet rs = statement.executeQuery(q3)) {

            System.out.printf("%-8s | %-15s | %-15s | %-18s%n",
                    "id", "nom", "prenom", "nb_seances_inclues");
            System.out.println("---------------------------------------------------------------");

            while (rs.next()) {
                System.out.printf("%-8d | %-15s | %-15s | %-18d%n",
                        rs.getInt("id"),
                        rs.getString("nom"),
                        rs.getString("prenom"),
                        rs.getInt("nb_seances_inclues"));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // *********************
    // QUESTION 4
    // Clients non abonnes pour lesquels il aurait ete financierement plus avantageux de souscrire un abonnement
    // **********************
    private static void executerQuestion4(Connection connexion, Scanner sc) {
        System.out.println("Entrez une date du 05/01/2025 au 08/03/2025");
        System.out.print("Date debut (YYYY-MM-DD) : ");
        java.sql.Date dateDebut = java.sql.Date.valueOf(sc.next());

        System.out.print("Date fin   (YYYY-MM-DD) : ");
        java.sql.Date dateFin = java.sql.Date.valueOf(sc.next());

        String q4 = "WITH prix_abo AS ( " +
                "  SELECT MIN(prix) AS prix FROM sds.abonnement " +
                "), depenses AS ( " +
                "  SELECT iss.client_id, ss.date_seance AS date_evt, iss.montant " +
                "  FROM sds.inscription_seance_specialisee iss " +
                "  JOIN sds.seance_specialisee ss ON ss.id = iss.seance_specialisee_id " +
                "  WHERE iss.montant > 0 " +
                "  UNION ALL " +
                "  SELECT sc.client_id, sc.date_seance AS date_evt, sc.montant " +
                "  FROM sds.seance_coaching sc " +
                "  WHERE sc.montant > 0 " +
                ") " +
                "SELECT " +
                "  c.id, c.nom, c.prenom, " +
                "  SUM(d.montant) AS total_paye_hors_abo, " +
                "  pa.prix AS prix_abonnement, " +
                "  SUM(d.montant) - pa.prix AS economie_potentielle " +
                "FROM sds.client c " +
                "CROSS JOIN prix_abo pa " +
                "JOIN depenses d ON d.client_id = c.id " +
                "WHERE d.date_evt BETWEEN ? AND ? " +
                "  AND NOT EXISTS ( " +
                "    SELECT 1 FROM sds.abonnement a " +
                "    WHERE a.client_id = c.id " +
                "      AND a.date_debut <= ? " +
                "      AND a.date_fin   >= ? " +
                "  ) " +
                "GROUP BY c.id, c.nom, c.prenom, pa.prix " +
                "HAVING SUM(d.montant) > pa.prix " +
                "ORDER BY economie_potentielle DESC, total_paye_hors_abo DESC;";

        try (PreparedStatement preparedStatement = connexion.prepareStatement(q4)) {

            // periode des depenses
            preparedStatement.setDate(1, dateDebut);
            preparedStatement.setDate(2, dateFin);

            // chevauchement abonnement sur la meme periode
            preparedStatement.setDate(3, dateFin);    // a.date_debut <= dateFin
            preparedStatement.setDate(4, dateDebut);  // a.date_fin   >= dateDebut

            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                System.out.printf("%-6s | %-15s | %-15s | %-18s | %-15s | %-20s%n",
                        "id", "nom", "prenom", "total_paye_hors_abo", "prix_abonnement", "economie_potentielle");
                System.out.println("------------------------------------------------------------------------------------------------------------");

                while (resultSet.next()) {
                    System.out.printf("%-6d | %-15s | %-15s | %-18.2f | %-15.2f | %-20.2f%n",
                            resultSet.getInt("id"),
                            resultSet.getString("nom"),
                            resultSet.getString("prenom"),
                            resultSet.getDouble("total_paye_hors_abo"),
                            resultSet.getDouble("prix_abonnement"),
                            resultSet.getDouble("economie_potentielle"));
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // ********************
    // QUESTION 5
    // Coachs qui ont plus de clients que la moyenne
    // ********************
    private static void executerQuestion5(Connection connexion) {
        String q5 = "WITH coach_client AS ( " +
                "    SELECT ss.id_coach AS coach_id, iss.client_id " +
                "    FROM sds.inscription_seance_specialisee iss " +
                "    JOIN sds.seance_specialisee ss " +
                "      ON ss.id = iss.seance_specialisee_id " +
                "    UNION " +
                "    SELECT sc.coach_id, sc.client_id " +
                "    FROM sds.seance_coaching sc " +
                "), " +
                "coach_stats AS ( " +
                "    SELECT coach_id, COUNT(DISTINCT client_id) AS nb_clients " +
                "    FROM coach_client " +
                "    GROUP BY coach_id " +
                "), " +
                "moyenne AS ( " +
                "    SELECT AVG(nb_clients) AS avg_clients " +
                "    FROM coach_stats " +
                ") " +
                "SELECT c.id, c.nom, c.prenom, cs.nb_clients " +
                "FROM coach_stats cs " +
                "JOIN sds.coach c ON c.id = cs.coach_id " +
                "CROSS JOIN moyenne m " +
                "WHERE cs.nb_clients > m.avg_clients " +
                "ORDER BY cs.nb_clients DESC, c.id;";

        try (Statement statement = connexion.createStatement();
             ResultSet rs = statement.executeQuery(q5)) {

            System.out.printf("%-6s | %-15s | %-15s | %-10s%n",
                    "id", "nom", "prenom", "nb_clients");
            System.out.println("----------------------------------------------------------");

            while (rs.next()) {
                System.out.printf("%-6d | %-15s | %-15s | %-10d%n",
                        rs.getInt("id"),
                        rs.getString("nom"),
                        rs.getString("prenom"),
                        rs.getInt("nb_clients"));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
