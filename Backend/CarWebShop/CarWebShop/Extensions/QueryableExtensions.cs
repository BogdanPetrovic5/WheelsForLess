using CarWebShop.Dto;
using CarWebShop.Models;
using System.Linq.Expressions;
using System.Reflection.Metadata;

namespace CarWebShop.Extensions
{
    public static class QueryableExtensions
    {
        public static IQueryable<T> ApplyFilters<T>(this IQueryable<T> source, AdvertisementFilter filter)
        {
            if (filter == null) return source;
            var parameters = Expression.Parameter(typeof(T), "parameters");
            Expression predicate = null;

            if (!string.IsNullOrEmpty(filter.CarBrand))
            {
                var brandMember = Expression.Property(Expression.Property(parameters, nameof(Advertisement.Car)), nameof(Car.CarBrand));
                var brandConstant = Expression.Constant(filter.CarBrand);
                var brandPredicate = Expression.Equal(brandMember, brandConstant);
                predicate = predicate == null ? brandPredicate : Expression.AndAlso(predicate, brandPredicate); 
            }
            if (!string.IsNullOrEmpty(filter.CarModel))
            {
                var modelMember = Expression.Property(Expression.Property(parameters, nameof(Advertisement.Car)), nameof(Car.CarModel));
                var modelConstant = Expression.Constant(filter.CarModel);
                var modelPredicate = Expression.Equal(modelMember, modelConstant);
                predicate = predicate == null ? modelPredicate : Expression.AndAlso(predicate, modelPredicate);
            }
            if (predicate != null)
            {
                var lambda = Expression.Lambda<Func<T, bool>>(predicate, parameters);
                source = source.Where(lambda);
            }

            return source;
        }
    }
}
