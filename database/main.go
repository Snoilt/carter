package main

import (
	_ "database/migrations"
	"database/routes"
	"log"
	"os"
	"strings"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

func main() {
	app := pocketbase.New()

	app.OnRecordAfterUpdateSuccess("rooms").BindFunc(func(e *core.RecordEvent) error {
		if len(e.Record.GetStringSlice("user")) == 0 {
			if err := e.App.Delete(e.Record); err != nil {
				return err
			}
		}

		log.Printf("subscriptions total clients: %d", e.App.SubscriptionsBroker().TotalClients())

		return e.Next()
	})

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		routes.Review(se)
		routes.Next(se)
		routes.Room(se)
		routes.Invites(se)

		se.Router.GET("/{path...}", apis.Static(os.DirFS("pb_public"), true))

		return se.Next()
	})

	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{

		Automigrate: isGoRun,
	})
	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
