from ..models.model import session
from ..models.active_subscription import ActiveSubscriptionFeature
from .base_command import BaseCommannd

class UpdateActiveSubscription(BaseCommannd):
    def __init__(self, active_subscription, base_subscription, features, notify_by_email):
        self.active_subscription = active_subscription
        self.base_subscription = base_subscription
        self.features = features
        self.notify_by_email = notify_by_email
    
    def execute(self):
        if not self.base_subscription or not self.features or\
           not self.active_subscription or not self.notify_by_email:
            raise ValueError("Invalid data provided")
        
        price = float(self.base_subscription["price"])
        for feature in self.features:
            price += float(feature["price"])

        try:
            self.active_subscription.base_id = self.base_subscription["id"]
            self.active_subscription.base_name = self.base_subscription["name"]
            self.active_subscription.description = self.base_subscription["description"]
            self.active_subscription.price = price
            self.active_subscription.notify_by_email = self.notify_by_email
            
            session.query(ActiveSubscriptionFeature).filter_by(plan_id=self.active_subscription.id).delete()
            session.flush()
            
            for feature in self.features:
                plan_feature = ActiveSubscriptionFeature(
                    plan_id=self.active_subscription.id,
                    feature_id=feature["id"],
                    feature_name=feature["name"],
                    feature_price=feature["price"],
                )
                session.add(plan_feature)

            session.commit()

            return self.active_subscription
        except Exception as e:
            session.rollback()
            raise e